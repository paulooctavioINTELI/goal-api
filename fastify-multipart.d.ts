declare module '@fastify/multipart' {
  import { FastifyPluginCallback } from 'fastify';

  interface FastifyMultipartOptions {
    addToBody?: boolean;
    limits?: {
      fieldNameSize?: number;
      fieldSize?: number;
      fields?: number;
      fileSize?: number;
      files?: number;
      headerPairs?: number;
    };
  }

  interface MultipartFile {
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    file: NodeJS.ReadableStream;
  }

  interface FastifyRequest {
    file: () => Promise<MultipartFile>;
    files: () => AsyncIterableIterator<MultipartFile>;
    parts: () => AsyncIterableIterator<MultipartFile>;
    saveRequestFiles: () => Promise<Array<{ filepath: string }>>;
  }

  const fastifyMultipart: FastifyPluginCallback<FastifyMultipartOptions>;
  export default fastifyMultipart;
}
