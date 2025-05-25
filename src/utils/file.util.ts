import {createReadStream} from 'fs';
import {createHash} from 'crypto';

async function sha256sum(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = createHash('sha256');
        const stream = createReadStream(filename, {highWaterMark: 128 * 1024});

        stream.on('data', (data: Buffer) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

export {sha256sum};
