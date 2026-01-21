/**
 * @generated SignedSource<<2f4c7b86cffcd0cc75996724e0af4580>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateUserProfileMutation$variables = {
  email?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
  phone?: string | null | undefined;
};
export type UpdateUserProfileMutation$data = {
  readonly updateusersCollection: {
    readonly records: ReadonlyArray<{
      readonly email: string | null | undefined;
      readonly id: string;
      readonly name: string | null | undefined;
      readonly phone: string | null | undefined;
    }>;
  };
};
export type UpdateUserProfileMutation = {
  response: UpdateUserProfileMutation$data;
  variables: UpdateUserProfileMutation$variables;
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
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "phone"
},
v4 = [
  {
    "fields": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "eq",
            "variableName": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "phone",
        "variableName": "phone"
      }
    ],
    "kind": "ObjectValue",
    "name": "set"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateUserProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "usersUpdateResponse",
        "kind": "LinkedField",
        "name": "updateusersCollection",
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
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
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
      (v0/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "UpdateUserProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "usersUpdateResponse",
        "kind": "LinkedField",
        "name": "updateusersCollection",
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
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
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
    "cacheID": "8250b2fc7b2ec9982a235f5d866748cb",
    "id": null,
    "metadata": {},
    "name": "UpdateUserProfileMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateUserProfileMutation(\n  $id: UUID!\n  $name: String\n  $email: String\n  $phone: String\n) {\n  updateusersCollection(set: {name: $name, email: $email, phone: $phone}, filter: {id: {eq: $id}}) {\n    records {\n      id\n      name\n      email\n      phone\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "aef6191ade0846573b43886d70dc9465";

export default node;
