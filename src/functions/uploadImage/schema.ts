export default {
    type: "object",
    properties: {
      file: { type: 'string' },
      mime: { type: 'string' }
    },
    required: ['file', 'mime']
  } as const;
  