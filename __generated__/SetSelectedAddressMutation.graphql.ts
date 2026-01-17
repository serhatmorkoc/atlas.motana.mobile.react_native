/**
 * @generated SignedSource<<a8f33382f51165ea4af8e0ced030007b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type SetSelectedAddressMutation$variables = {
  id: string;
  is_selected: boolean;
};
export type SetSelectedAddressMutation$data = {
  readonly updateuser_addressesCollection: {
    readonly records: ReadonlyArray<{
      readonly id: string;
      readonly is_selected: boolean | null | undefined;
    }>;
  };
};
export type SetSelectedAddressMutation = {
  response: SetSelectedAddressMutation$data;
  variables: SetSelectedAddressMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "is_selected"
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
  },
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "is_selected",
        "variableName": "is_selected"
      }
    ],
    "kind": "ObjectValue",
    "name": "set"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_selected",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SetSelectedAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "user_addressesUpdateResponse",
        "kind": "LinkedField",
        "name": "updateuser_addressesCollection",
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
              (v3/*: any*/)
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
    "name": "SetSelectedAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "user_addressesUpdateResponse",
        "kind": "LinkedField",
        "name": "updateuser_addressesCollection",
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
              (v3/*: any*/),
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
    "cacheID": "1104096448835909fbf695ad09c7c4e9",
    "id": null,
    "metadata": {},
    "name": "SetSelectedAddressMutation",
    "operationKind": "mutation",
    "text": "mutation SetSelectedAddressMutation(\n  $id: UUID!\n  $is_selected: Boolean!\n) {\n  updateuser_addressesCollection(set: {is_selected: $is_selected}, filter: {id: {eq: $id}}) {\n    records {\n      id\n      is_selected\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f64ef3ddc31d3ed24d1cd4e932bda896";

export default node;
