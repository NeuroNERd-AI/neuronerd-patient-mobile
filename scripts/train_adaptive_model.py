#!/usr/bin/env python3
"""Train a tiny activity-only logistic model and emit an on-device JSON artifact.
Input JSONL fields: features (10 floats) and label (0 or 1).
This script is intentionally dependency-free for reproducible development builds.
"""
import json, math, sys

def sigmoid(z): return 1.0 / (1.0 + math.exp(-max(-30.0, min(30.0, z))))
def main():
    if len(sys.argv) != 3: raise SystemExit('usage: train_adaptive_model.py input.jsonl output.json')
    rows = [json.loads(line) for line in open(sys.argv[1], encoding='utf-8') if line.strip()]
    if not rows: raise SystemExit('input has no rows')
    width = len(rows[0]['features']); weights = [0.0] * width; bias = 0.0
    for _ in range(800):
        grad = [0.0] * width; bias_grad = 0.0
        for row in rows:
            x = row['features']; y = float(row['label']); error = sigmoid(bias + sum(w * v for w, v in zip(weights, x))) - y
            bias_grad += error
            for i, value in enumerate(x): grad[i] += error * value
        learning_rate = 0.08 / len(rows)
        weights = [w - learning_rate * g for w, g in zip(weights, grad)]
        bias -= learning_rate * bias_grad
    artifact = {'modelVersion': 'logistic-trained-v1', 'schemaVersion': 'adaptive-features-v1', 'trainedFor': 'next-session-completion-probability', 'bias': bias, 'weights': weights, 'trainingRows': len(rows), 'notes': 'Activity-only, non-clinical recommendation model.'}
    with open(sys.argv[2], 'w', encoding='utf-8') as out: json.dump(artifact, out, indent=2)
if __name__ == '__main__': main()
