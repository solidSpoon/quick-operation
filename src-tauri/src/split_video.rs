use chrono::{ NaiveTime};
use regex::Regex;

use std::io::{self, BufRead};
use std::path::PathBuf;



pub fn split_file(file_names: Vec<String>, time_stamp: &str) -> () {
    println!("time_stamp: {}", time_stamp);
    let lines = time_stamp.lines().map(|line| Line::from(line)).collect::<Vec<_>>();
    let time_stamps = TimeStamp::from(&lines);
    let file_holders = file_names.iter().map(|file_name| FileHolder::new(file_name)).collect::<Vec<_>>();
    for file_holder in file_holders {
        split_one_file(&file_holder, &time_stamps);
    }
}

fn split_one_file(file_holder: &FileHolder, time_stamps : &Vec<TimeStamp>) -> () {
    for time_stamp in time_stamps {
        split_video(file_holder, time_stamp);
    }
}


#[derive(Debug, PartialEq)]
enum FileType {
    Video,
    Subtitle,
    None,
}

struct FileHolder {
    /// 文件路径+文件名
    file_path: String,

    /// 文件名
    file_name: String,

    /// 文件夹路径
    file_folder: String,

    /// 文件类型
    file_type: FileType,
}

impl FileHolder {
    fn new(file_path: &str) -> FileHolder {
        let file_path = file_path.to_string();
        let file_name = file_path.split("/").last().unwrap().to_string();
        let file_folder = file_path.replace(&file_name, "");
        let file_type = match file_name.split(".").last().unwrap() {
            "mp4" => FileType::Video,
            "srt" => FileType::Subtitle,
            _ => FileType::None,
        };
        FileHolder {
            file_path,
            file_name,
            file_folder,
            file_type,
        }
    }
}


struct Line {
    time: NaiveTime,
    name: String,
}

impl Line {
    fn from(line: &str) -> Line {
        println!("line: {}", line);
        let re = Regex::new(r"^(\d{2}:\d{2}:\d{2})\s+(.*)$").unwrap();
        let caps = re.captures(line).unwrap();
        let time = NaiveTime::parse_from_str(&caps[1], "%H:%M:%S").unwrap();
        let name = caps[2].to_string();
        Line { time, name }
    }
}

struct TimeStamp {
    start_time: NaiveTime,
    end_time: Option<NaiveTime>,
    index: usize,
    name: String,
}

impl TimeStamp {
    fn from(lines: &Vec<Line>) -> Vec<TimeStamp> {
        let mut time_stamps = Vec::new();
        let mut index = 0;
        let mut start_time = NaiveTime::from_hms(0, 0, 0);
        let mut end_time = NaiveTime::from_hms(0, 0, 0);
        let mut name = String::new();
        for line in lines {
            if index == 0 {
                start_time = line.time;
                name = line.name.clone();
            } else {
                end_time = line.time;
                time_stamps.push(TimeStamp {
                    start_time,
                    end_time: Some(end_time),
                    index,
                    name: name.clone(),
                });
                start_time = end_time;
                name = line.name.clone();
            }
            index += 1;
        }
        time_stamps.push(TimeStamp {
            start_time,
            end_time: None,
            index,
            name: name.clone(),
        });

        time_stamps
    }
}

fn split_video(file_holder: &FileHolder, time_stamp: &TimeStamp) -> io::Result<()> {
    if file_holder.file_type != FileType::Video {
        return Ok(());
    }
    // 在视频文件所在目录创建同名文件夹
    let bath_path = PathBuf::from(file_holder.file_folder.clone());
    let output_folder = bath_path.join(&file_holder.file_name.replace(".", "_"));
    std::fs::create_dir_all(&output_folder)?;

    let output_filename = format!(
        "{}/{}_{}_{}.mp4",
        output_folder.to_str().unwrap(),
        time_stamp.index,
        time_stamp.start_time.format("%H-%M-%S"),
        escape_special_chars(time_stamp.name.as_ref())
    );
    println!("Splitting {} to {}", file_holder.file_path, output_filename);

    let cmd = match time_stamp.end_time {
        Some(end_time) => format!(
            "ffmpeg -ss {} -t {} -accurate_seek -i {} -codec copy  -avoid_negative_ts 1 {}",
            time_stamp.start_time.format("%H:%M:%S"),
            end_time.signed_duration_since(time_stamp.start_time).num_seconds(),
            file_holder.file_path,
            output_filename
        ),
        None => format!(
            "ffmpeg -ss {} -accurate_seek -i {} -codec copy  -avoid_negative_ts 1 {}",
            time_stamp.start_time.format("%H:%M:%S"),
            file_holder.file_path,
            output_filename
        ),
    };

    println!("cmd: {}", cmd);

    let status = std::process::Command::new("sh")
        .arg("-c")
        .arg(&cmd)
        .status()?;

    if !status.success() {
        eprintln!("Failed to execute ffmpeg command: {:?}", cmd);
    }

    Ok(())
}


fn parse_line(line: &str) -> Option<(NaiveTime, String)> {
    let re = Regex::new(r"^(\d{2}:\d{2}:\d{2})\s+(.*)$").unwrap();
    if let Some(caps) = re.captures(line) {
        if let Ok(timestamp) = NaiveTime::parse_from_str(&caps[1], "%H:%M:%S") {
            let filename = caps[2].to_string();
            return Some((timestamp, filename));
        }
    }

    None
}

/// 去除文件名中的特殊字符
fn escape_special_chars(filename: &str) -> String {
    let special_chars = ['$', '`', '"', '\\', ' '];
    let mut escaped_filename = String::new();
    for c in filename.chars() {
        if special_chars.contains(&c) {
            escaped_filename.push('\\');
        }
        escaped_filename.push(c);
    }
    escaped_filename
}
