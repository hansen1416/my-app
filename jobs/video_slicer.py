import os
import cv2


def video_slicer(filepath, start_time, end_time):

    filename, fileext = os.path.basename(filepath).split('.')

    cap = cv2.VideoCapture(filepath)
    # read frame per second
    fps = cap.get(cv2.CAP_PROP_FPS)

    start_frame = start_time*fps
    end_frame = end_time*fps

    ret, frame = cap.read()
    h, w, _ = frame.shape

    # Define a fourcc (four-character code), and define a video writers
    # fourcc = cv2.VideoWriter_fourcc(*"XVID")
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(
        os.path.join('slices', f"{filename}_{start_time}-{end_time}.{fileext}"), fourcc, fps, (w, h))

    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    f = start_frame
    while ret:
        f += 1

        if start_frame <= f <= end_frame:
            writer.write(frame)

        if f > end_frame:
            break

        ret, frame = cap.read()

    writer.release()

    cap.release()


if __name__ == "__main__":

    import argparse

    parser = argparse.ArgumentParser(
        prog='Save Video slices',
        description='Save a piece of video from `start_time` to `end_time` to a new file names `filename_starttime_endtime`',
        epilog='end===================')

    parser.add_argument(
        'filename', type=str, help="Path of a video file")
    parser.add_argument("-s", "--start", default="1", type=int, metavar="start time",
                        help="Start time")
    parser.add_argument("-e", "--end", default="-1", type=int, metavar="end time",
                        help="End time")

    args = parser.parse_args()

    video_slicer(args.filename, args.start, args.end)