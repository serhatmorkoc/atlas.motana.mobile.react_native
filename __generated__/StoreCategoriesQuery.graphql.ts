/**
 * @generated SignedSource<<82c2fcda034f8113d9ebde2ca5acaec1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StoreCategoriesQuery$variables = Record<PropertyKey, never>;
export type StoreCategoriesQuery$data = {
  readonly store_categoriesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly color: string | null | undefined;
        readonly icon: string | null | undefined;
        readonly id: string;
        readonly is_active: boolean | null | undefined;
        readonly name: string;
      };
    }>;
  } | null | undefined;
};
export type StoreCategoriesQuery = {
  response: StoreCategoriesQuery$data;
  variables: StoreCategoriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "filter",
    "value": {
      "is_active": {
        "eq": true
      }
    }
  },
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": {
      "id": "AscNullsLast"
    }
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "icon",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_active",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "StoreCategoriesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "store_categoriesConnection",
        "kind": "LinkedField",
        "name": "store_categoriesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "store_categoriesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "store_categories",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "store_categoriesCollection(filter:{\"is_active\":{\"eq\":true}},orderBy:{\"id\":\"AscNullsLast\"})"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "StoreCategoriesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "store_categoriesConnection",
        "kind": "LinkedField",
        "name": "store_categoriesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "store_categoriesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "store_categories",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
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
        ],
        "storageKey": "store_categoriesCollection(filter:{\"is_active\":{\"eq\":true}},orderBy:{\"id\":\"AscNullsLast\"})"
      }
    ]
  },
  "params": {
    "cacheID": "00087f3464477c437a7e3aee7f3cfbc0",
    "id": null,
    "metadata": {},
    "name": "StoreCategoriesQuery",
    "operationKind": "query",
    "text": "query StoreCategoriesQuery {\n  store_categoriesCollection(filter: {is_active: {eq: true}}, orderBy: {id: AscNullsLast}) {\n    edges {\n      node {\n        id\n        name\n        icon\n        color\n        is_active\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "04f55a8db7204f974ebd479f408c9e7e";

export default node;
