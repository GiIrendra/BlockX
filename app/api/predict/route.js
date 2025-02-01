import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const pythonProcess = spawn('python', ['scripts/predict.py']);

        return new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error('Python script failed'));
                    return;
                }

                // Read predictions from JSON
                const filePath = path.join(process.cwd(), 'predictions.json');
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                resolve(NextResponse.json(data));
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Python script error: ${data}`);
            });
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
    }
}
