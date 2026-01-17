/**
 * @generated SignedSource<<f003025e3c221c10bd5e2f0c43d72282>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateUserMutation$variables = {
  email: string;
  id: string;
  name: string;
};
export type CreateUserMutation$data = {
  readonly insertIntousersCollection: {
    readonly records: ReadonlyArray<{
      readonly email: string | null | undefined;
      readonly id: string;
      readonly is_active: boolean | null | undefined;
      readonly name: string | null | undefined;
      readonly phone: string | null | undefined;
      readonly user_type: string | null | undefined;
    }>;
  } | null | undefined;
};
export type CreateUserMutation = {
  response: CreateUserMutation$data;
  variables: CreateUserMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v3 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Literal",
        "name": "is_active",
        "value": true
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Literal",
        "name": "user_type",
        "value": "CUSTOMER"
      }
    ],
    "kind": "ObjectValue",
    "name": "objects"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_type",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_active",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "usersInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntousersCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "users",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CreateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "usersInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntousersCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "users",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "nodeId",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "dabc526f63fe993bfc41d30fb020de27",
    "id": null,
    "metadata": {},
    "name": "CreateUserMutation",
    "operationKind": "mutation",
    "text": "mutation CreateUserMutation(\n  $id: UUID!\n  $name: String!\n  $email: String!\n) {\n  insertIntousersCollection(objects: {id: $id, name: $name, email: $email, user_type: \"CUSTOMER\", is_active: true}) {\n    records {\n      id\n      name\n      email\n      phone\n      user_type\n      is_active\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "bb4b37e2a2d981cf24c37898f65c38db";

export default node;
