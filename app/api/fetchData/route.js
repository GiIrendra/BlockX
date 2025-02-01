import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-key': 'f5437a86805317c7a27e24faa4e2c2be',
        },
    };

    try {
        const response = await fetch(
            'https://api.unleashnfts.com/api/v2/token/price_prediction?offset=0&limit=100',
            options
        );
        const data = await response.json();
        console.log(process.cwd());
        // Save to file
        const filePath = path.join(process.cwd(), 'data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
