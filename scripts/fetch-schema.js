/**
 * Script to fetch GraphQL schema from Supabase and convert to SDL
 * Run: npm run fetch-schema
 * 
 * Note: Supabase Dashboard'da doğrudan schema export yok.
 * Bu script Supabase GraphQL endpoint'ine introspection query göndererek schema'yı çeker.
 */

const fs = require('fs');
const path = require('path');
const { buildClientSchema, printSchema } = require('graphql');

// Load environment variables from .env if exists
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {
  // .env file might not exist, that's okay
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_GRAPHQL_URL = process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: EXPO_PUBLIC_SUPABASE_ANON_KEY must be set');
  console.error('   Set it in your .env file or environment variables');
  process.exit(1);
}

// Use EXPO_PUBLIC_SUPABASE_GRAPHQL_URL if available, otherwise construct from SUPABASE_URL
const graphqlUrl = SUPABASE_GRAPHQL_URL 
  ? SUPABASE_GRAPHQL_URL
  : (SUPABASE_URL 
    ? (SUPABASE_URL.endsWith('/graphql/v1') 
      ? SUPABASE_URL 
      : `${SUPABASE_URL.replace(/\/$/, '')}/graphql/v1`)
    : '');

if (!graphqlUrl) {
  console.error('❌ Error: EXPO_PUBLIC_SUPABASE_GRAPHQL_URL or EXPO_PUBLIC_SUPABASE_URL must be set');
  console.error('   Set them in your .env file or environment variables');
  process.exit(1);
}

const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchSchema() {
  try {
    console.log('📡 Fetching schema from:', graphqlUrl);
    
    // Use dynamic import for node-fetch (CommonJS compatible)
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      throw new Error('Failed to fetch schema');
    }

    if (!result.data || !result.data.__schema) {
      throw new Error('Invalid schema response');
    }

    console.log('✅ Schema fetched successfully!');
    
    // Convert introspection result to GraphQL schema SDL
    const schema = buildClientSchema(result.data);
    const sdl = printSchema(schema);
    
    // Save schema.graphql file
    const schemaPath = path.join(__dirname, '../schema.graphql');
    fs.writeFileSync(schemaPath, sdl);
    console.log('✅ Schema saved to:', schemaPath);
    
    // Also save introspection result as JSON for reference
    const jsonPath = path.join(__dirname, '../schema.json');
    fs.writeFileSync(jsonPath, JSON.stringify(result.data, null, 2));
    console.log('✅ Introspection result saved to:', jsonPath);
    console.log('\n🎉 Schema fetch completed! You can now run: npm run relay');
    
  } catch (error) {
    console.error('❌ Error fetching schema:', error.message);
    if (error.message.includes('Cannot find module')) {
      console.error('   Make sure node-fetch is installed: npm install --save-dev node-fetch@2');
    }
    process.exit(1);
  }
}

fetchSchema();
