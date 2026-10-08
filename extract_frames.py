import imageio_ffmpeg
import subprocess

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

command = [
    ffmpeg,
    "-i", "public/video/character.mp4",
    "-vf", "fps=8,scale=720:-1",
    "-q:v", "2",
    "public/pngframes/frame-%03d.png"
]

subprocess.run(command, check=True)

print("PNG EXTRACTION COMPLETE")