/**
 * Streaming: Complete Example
 * 
 * Examples of streaming responses in NestJS.
 */

import { Controller, Get, Post, Res, Param, StreamableFile, Injectable, Module } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Readable, Transform } from 'stream';

// ============================================================================
// File Streaming
// ============================================================================

@Controller('streaming')
export class StreamingController {
  @Get('file')
  getFile(@Res({ passthrough: true }) res: Response) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }

  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'uploads', filename));
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    file.pipe(res);
  }
}

// ============================================================================
// Data Streaming
// ============================================================================

@Controller('streaming')
export class DataStreamingController {
  @Get('data')
  streamData(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream JSON array
    res.write('[');

    for (let i = 0; i < 10; i++) {
      const data = {
        id: i,
        name: `Item ${i}`,
        timestamp: new Date().toISOString(),
      };

      res.write(JSON.stringify(data));
      if (i < 9) {
        res.write(',');
      }

      // Simulate delay
      // In real scenario, this would be async data fetching
    }

    res.write(']');
    res.end();
  }

  @Get('csv')
  streamCSV(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

    // CSV header
    res.write('id,name,email\n');

    // Stream CSV rows
    for (let i = 0; i < 100; i++) {
      res.write(`${i},User ${i},user${i}@example.com\n`);
    }

    res.end();
  }
}

// ============================================================================
// Large Dataset Streaming
// ============================================================================

@Injectable()
export class StreamingService {
  async *streamLargeDataset() {
    // Simulate streaming large dataset
    for (let i = 0; i < 1000; i++) {
      yield {
        id: i,
        name: `Item ${i}`,
        data: Array(100).fill(0).map((_, j) => ({
          field: j,
          value: Math.random(),
        })),
      };

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
}

@Controller('streaming')
export class LargeDatasetController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('large-dataset')
  async streamLargeDataset(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write('[');

    let first = true;
    for await (const item of this.streamingService.streamLargeDataset()) {
      if (!first) {
        res.write(',');
      }
      res.write(JSON.stringify(item));
      first = false;
    }

    res.write(']');
    res.end();
  }
}

// ============================================================================
// Video Streaming
// ============================================================================

@Controller('streaming')
export class VideoStreamingController {
  @Get('video/:filename')
  streamVideo(@Param('filename') filename: string, @Res() res: Response) {
    const videoPath = join(process.cwd(), 'videos', filename);
    const videoStat = require('fs').statSync(videoPath);
    const fileSize = videoStat.size;
    const range = res.req.headers.range;

    if (range) {
      // Partial content (video seeking)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = createReadStream(videoPath, { start, end });

      res.status(206); // Partial Content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunksize);
      res.setHeader('Content-Type', 'video/mp4');

      file.pipe(res);
    } else {
      // Full video
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', 'video/mp4');
      createReadStream(videoPath).pipe(res);
    }
  }
}

// ============================================================================
// Real-time Data Streaming
// ============================================================================

@Controller('streaming')
export class RealTimeStreamingController {
  @Get('realtime')
  streamRealtime(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(() => {
      const data = {
        timestamp: new Date().toISOString(),
        value: Math.random(),
        metrics: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
        },
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1000);

    res.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }
}

// ============================================================================
// Transform Stream
// ============================================================================

@Controller('streaming')
export class TransformStreamController {
  @Get('transform')
  transformStream(@Res() res: Response) {
    const transform = new Transform({
      transform(chunk, encoding, callback) {
        // Transform data
        const data = JSON.parse(chunk.toString());
        const transformed = {
          ...data,
          processed: true,
          processedAt: new Date().toISOString(),
        };
        callback(null, JSON.stringify(transformed) + '\n');
      },
    });

    // Create readable stream
    const readable = new Readable({
      read() {
        for (let i = 0; i < 10; i++) {
          this.push(JSON.stringify({ id: i, name: `Item ${i}` }) + '\n');
        }
        this.push(null); // End stream
      },
    });

    res.setHeader('Content-Type', 'application/json');
    readable.pipe(transform).pipe(res);
  }
}

// ============================================================================
// Module Setup
// ============================================================================

@Module({
  controllers: [
    StreamingController,
    DataStreamingController,
    LargeDatasetController,
    VideoStreamingController,
    RealTimeStreamingController,
    TransformStreamController,
  ],
  providers: [StreamingService],
})
export class StreamingModule {}

