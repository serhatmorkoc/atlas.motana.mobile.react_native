/**
 * @generated SignedSource<<8d485ed86de3b09849ae07041a7ce680>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ProductVariationsQuery$variables = {
  productId: string;
};
export type ProductVariationsQuery$data = {
  readonly product_variationsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly discounted_price: string | null | undefined;
        readonly id: string;
        readonly price: string;
        readonly product_id: string | null | undefined;
        readonly stock_quantity: number | null | undefined;
        readonly title: string | null | undefined;
      };
    }>;
  } | null | undefined;
};
export type ProductVariationsQuery = {
  response: ProductVariationsQuery$data;
  variables: ProductVariationsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "productId"
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
            "variableName": "productId"
          }
        ],
        "kind": "ObjectValue",
        "name": "product_id"
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "product_id",
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
  "name": "price",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "discounted_price",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stock_quantity",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProductVariationsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "product_variationsConnection",
        "kind": "LinkedField",
        "name": "product_variationsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "product_variationsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "product_variations",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
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
    "name": "ProductVariationsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "product_variationsConnection",
        "kind": "LinkedField",
        "name": "product_variationsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "product_variationsEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "product_variations",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
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
    "cacheID": "6bf452321f05f587fbb08261d52e12ff",
    "id": null,
    "metadata": {},
    "name": "ProductVariationsQuery",
    "operationKind": "query",
    "text": "query ProductVariationsQuery(\n  $productId: UUID!\n) {\n  product_variationsCollection(filter: {product_id: {eq: $productId}}) {\n    edges {\n      node {\n        id\n        product_id\n        title\n        price\n        discounted_price\n        stock_quantity\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b7d940a5c7974ae33ded7fe8f182c72b";

export default node;
