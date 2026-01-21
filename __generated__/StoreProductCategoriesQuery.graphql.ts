/**
 * @generated SignedSource<<114834d7daa83829b61fa1c47cd61f37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type StoreProductCategoriesQuery$variables = {
  storeId: string;
};
export type StoreProductCategoriesQuery$data = {
  readonly product_categoriesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly sort_order: number | null | undefined;
        readonly store_id: string | null | undefined;
        readonly title: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type StoreProductCategoriesQuery = {
  response: StoreProductCategoriesQuery$data;
  variables: StoreProductCategoriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "storeId"
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
            "variableName": "storeId"
          }
        ],
        "kind": "ObjectValue",
        "name": "store_id"
      }
    ],
    "kind": "ObjectValue",
    "name": "filter"
  },
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": {
      "sort_order": "AscNullsLast"
    }
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
  "name": "store_id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sort_order",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StoreProductCategoriesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "product_categoriesConnection",
        "kind": "LinkedField",
        "name": "product_categoriesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "product_categoriesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "product_categories",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
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
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "StoreProductCategoriesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "product_categoriesConnection",
        "kind": "LinkedField",
        "name": "product_categoriesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "product_categoriesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "product_categories",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "59c7155da0e5f6d1f0c96477d366968b",
    "id": null,
    "metadata": {},
    "name": "StoreProductCategoriesQuery",
    "operationKind": "query",
    "text": "query StoreProductCategoriesQuery(\n  $storeId: UUID!\n) {\n  product_categoriesCollection(filter: {store_id: {eq: $storeId}}, orderBy: {sort_order: AscNullsLast}) {\n    edges {\n      node {\n        id\n        store_id\n        title\n        sort_order\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7cab0808adcdaf8b7709ff1c0f4d793f";

export default node;
