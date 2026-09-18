"""
Download Hugging Face Datasets for Geetha GPT:
1. JDhruv14/Bhagavad-Gita-QA
2. abagade/bhagavad-gita-guidance-qa
"""

import os
import urllib.request
import sys
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha/dataset/external"
os.makedirs(BASE_DIR, exist_ok=True)

DATASETS = {
    "JDhruv14_Bhagavad_Gita_QA": {
        "base_url": "https://huggingface.co/datasets/JDhruv14/Bhagavad-Gita-QA/raw/main/",
        "files": [
            ("English/english.csv", "English/english.csv"),
            ("Hindi/hindi.csv", "Hindi/hindi.csv"),
            ("Gujarati/gujarati.csv", "Gujarati/gujarati.csv"),
            ("README.md", "README.md")
        ]
    },
    "abagade_bhagavad_gita_guidance_qa": {
        "base_url": "https://huggingface.co/datasets/abagade/bhagavad-gita-guidance-qa/resolve/main/",
        "files": [
            ("data/train-00000-of-00001.parquet", "train-00000-of-00001.parquet"),
            ("README.md", "README.md")
        ]
    }
}

def download_file(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    print(f"Downloading {url} -> {target_path}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as resp, open(target_path, 'wb') as out_file:
        chunk_size = 64 * 1024
        downloaded = 0
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
    print(f"  Done ({downloaded:,} bytes)")

def main():
    print("=" * 60)
    print("DOWNLOADING HUGGINGFACE DATASETS")
    print("=" * 60)

    for ds_name, info in DATASETS.items():
        ds_dir = os.path.join(BASE_DIR, ds_name)
        os.makedirs(ds_dir, exist_ok=True)
        print(f"\nProcessing {ds_name}...")
        
        for remote_rel, local_rel in info["files"]:
            remote_url = info["base_url"] + remote_rel
            local_path = os.path.join(ds_dir, local_rel)
            download_file(remote_url, local_path)

    # Convert abagade parquet to jsonl for easy inspection and processing
    parquet_path = os.path.join(BASE_DIR, "abagade_bhagavad_gita_guidance_qa", "train-00000-of-00001.parquet")
    if os.path.exists(parquet_path):
        print("\nConverting abagade parquet to JSONL...")
        df_parquet = pd.read_parquet(parquet_path)
        jsonl_path = os.path.join(BASE_DIR, "abagade_bhagavad_gita_guidance_qa", "guidance_dialogues.jsonl")
        df_parquet.to_json(jsonl_path, orient="records", lines=True, force_ascii=False)
        print(f"Saved {len(df_parquet)} dialogue records to {jsonl_path}")

    print("\n" + "=" * 60)
    print("ALL DATASETS DOWNLOADED AND PREPARED SUCCESSFULLY")
    print("=" * 60)

if __name__ == "__main__":
    main()
