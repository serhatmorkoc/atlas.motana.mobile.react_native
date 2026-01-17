/**
 * @generated SignedSource<<de59c6a4444ba3e61745201982ebf6a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type order_itemsInsertInput = {
  id?: string | null | undefined;
  image?: string | null | undefined;
  order_id?: string | null | undefined;
  product_id?: string | null | undefined;
  product_title?: string | null | undefined;
  quantity?: number | null | undefined;
  total_price?: string | null | undefined;
  unit_price?: string | null | undefined;
};
export type CreateOrderItemsMutation$variables = {
  items: ReadonlyArray<order_itemsInsertInput>;
};
export type CreateOrderItemsMutation$data = {
  readonly insertIntoorder_itemsCollection: {
    readonly records: ReadonlyArray<{
      readonly id: string;
      readonly image: string | null | undefined;
      readonly order_id: string | null | undefined;
      readonly product_id: string | null | undefined;
      readonly product_title: string | null | undefined;
      readonly quantity: number | null | undefined;
      readonly total_price: string | null | undefined;
      readonly unit_price: string | null | undefined;
    }>;
  } | null | undefined;
};
export type CreateOrderItemsMutation = {
  response: CreateOrderItemsMutation$data;
  variables: CreateOrderItemsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "items"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "objects",
    "variableName": "items"
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
  "name": "order_id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "product_id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "product_title",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unit_price",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "total_price",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "image",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateOrderItemsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "order_itemsInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntoorder_itemsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "order_items",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateOrderItemsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "order_itemsInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntoorder_itemsCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "order_items",
            "kind": "LinkedField",
            "name": "records",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
    "cacheID": "49eaba645f6065cd4249e8da4ad6a34c",
    "id": null,
    "metadata": {},
    "name": "CreateOrderItemsMutation",
    "operationKind": "mutation",
    "text": "mutation CreateOrderItemsMutation(\n  $items: [order_itemsInsertInput!]!\n) {\n  insertIntoorder_itemsCollection(objects: $items) {\n    records {\n      id\n      order_id\n      product_id\n      product_title\n      quantity\n      unit_price\n      total_price\n      image\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "17d969fc98b105967a7e94c4443a5100";

export default node;
