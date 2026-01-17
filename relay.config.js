module.exports = {
  src: './',
  schema: './schema.graphql',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  language: 'typescript',
  artifactDirectory: './__generated__',
  schemaConfig: {
    // Supabase uses 'nodeId' instead of 'id' for Node interface
    nodeInterfaceIdField: 'nodeId',
    nodeInterfaceIdVariableName: 'nodeId',
  },
  customScalarTypes: {
    UUID: 'string',
    Datetime: 'string',
    JSON: 'string',
    BigInt: 'string',
    BigFloat: 'string',
    Opaque: 'any',
    Cursor: 'string',
    Date: 'string',
    Time: 'string',
  },
};
