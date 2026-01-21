/**
 * @generated SignedSource<<d2781ff60dab8b5af2242594d4985291>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteUserAddressMutation$variables = {
  id: string;
};
export type DeleteUserAddressMutation$data = {
  readonly deleteFromuser_addressesCollection: {
    readonly records: ReadonlyArray<{
      readonly id: string;
    }>;
  };
};
export type DeleteUserAddressMutation = {
  response: DeleteUserAddressMutation$data;
  variables: DeleteUserAddressMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
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
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "user_addressesDeleteResponse",
        "kind": "LinkedField",
        "name": "deleteFromuser_addressesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "user_addresses",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "user_addressesDeleteResponse",
        "kind": "LinkedField",
        "name": "deleteFromuser_addressesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "user_addresses",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
    "cacheID": "4eb72646f2dc609ba5efcc79be20f3af",
    "id": null,
    "metadata": {},
    "name": "DeleteUserAddressMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteUserAddressMutation(\n  $id: UUID!\n) {\n  deleteFromuser_addressesCollection(filter: {id: {eq: $id}}) {\n    records {\n      id\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "52cb1634f200a50304801838456baa97";

export default node;
