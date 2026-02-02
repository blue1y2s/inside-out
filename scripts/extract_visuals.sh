#!/bin/bash

# Inside Out 2 Visual Reference Extraction Script
# This script extracts key frames from the movie to use as visual references

MOVIE_PATH="../reference/movie/Inside.Out.2.2024.1080p.WEB-DL.DDP5.1.Atmos.H.264-FLUX.mkv"
OUTPUT_BASE="../reference/extracted"

echo "🎬 Starting Inside Out 2 visual extraction..."

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed. Please install it first:"
    echo "   brew install ffmpeg"
    exit 1
fi

# Test mode - just verify the movie file exists
if [ "$1" == "--test" ]; then
    if [ -f "$MOVIE_PATH" ]; then
        echo "✅ Movie file found: $MOVIE_PATH"
        echo "✅ Output directory exists: $OUTPUT_BASE"
        exit 0
    else
        echo "❌ Movie file not found: $MOVIE_PATH"
        exit 1
    fi
fi

# Extract frames at specific timestamps representing different emotions
# Note: These timestamps are estimates and may need adjustment after viewing

echo "📸 Extracting Joy scenes (golden yellow)..."
ffmpeg -ss 00:05:30 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/joy/joy_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:12:45 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/joy/joy_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:25:10 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/joy/joy_03.jpg" -y 2>/dev/null

echo "📸 Extracting Sadness scenes (deep blue)..."
ffmpeg -ss 00:08:20 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/sadness/sadness_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:18:40 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/sadness/sadness_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:35:15 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/sadness/sadness_03.jpg" -y 2>/dev/null

echo "📸 Extracting Anxiety scenes (vibrant orange)..."
ffmpeg -ss 00:15:30 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/anxiety/anxiety_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:28:50 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/anxiety/anxiety_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:42:20 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/anxiety/anxiety_03.jpg" -y 2>/dev/null

echo "📸 Extracting Envy scenes (cyan-green)..."
ffmpeg -ss 00:20:15 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/envy/envy_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:33:40 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/envy/envy_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:48:25 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/envy/envy_03.jpg" -y 2>/dev/null

echo "📸 Extracting Embarrassment scenes (soft pink)..."
ffmpeg -ss 00:22:30 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/embarrassment/embarrassment_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:38:10 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/embarrassment/embarrassment_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:52:45 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/emotions/embarrassment/embarrassment_03.jpg" -y 2>/dev/null

echo "📸 Extracting Memory Sphere close-ups..."
ffmpeg -ss 00:03:15 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/memory_spheres/sphere_01.jpg" -y 2>/dev/null
ffmpeg -ss 00:10:30 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/memory_spheres/sphere_02.jpg" -y 2>/dev/null
ffmpeg -ss 00:16:45 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/memory_spheres/sphere_03.jpg" -y 2>/dev/null
ffmpeg -ss 00:30:20 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/memory_spheres/sphere_04.jpg" -y 2>/dev/null
ffmpeg -ss 00:45:50 -i "$MOVIE_PATH" -frames:v 1 -q:v 2 "$OUTPUT_BASE/memory_spheres/sphere_05.jpg" -y 2>/dev/null

echo "🎨 Generating color histograms for analysis..."
ffmpeg -ss 00:05:30 -i "$MOVIE_PATH" -frames:v 1 -vf "histogram=display_mode=overlay" -q:v 2 "$OUTPUT_BASE/color_analysis/joy_histogram.jpg" -y 2>/dev/null
ffmpeg -ss 00:08:20 -i "$MOVIE_PATH" -frames:v 1 -vf "histogram=display_mode=overlay" -q:v 2 "$OUTPUT_BASE/color_analysis/sadness_histogram.jpg" -y 2>/dev/null
ffmpeg -ss 00:15:30 -i "$MOVIE_PATH" -frames:v 1 -vf "histogram=display_mode=overlay" -q:v 2 "$OUTPUT_BASE/color_analysis/anxiety_histogram.jpg" -y 2>/dev/null

echo ""
echo "✅ Extraction complete!"
echo "📁 Check the following directories:"
echo "   - $OUTPUT_BASE/emotions/"
echo "   - $OUTPUT_BASE/memory_spheres/"
echo "   - $OUTPUT_BASE/color_analysis/"
