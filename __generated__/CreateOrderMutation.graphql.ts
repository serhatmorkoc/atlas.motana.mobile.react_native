/**
 * @generated SignedSource<<d15924bc52f88075dadb9335d5c5b954>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ordersInsertInput = {
  courier_id?: string | null | undefined;
  courier_queue?: ReadonlyArray<string | null | undefined> | null | undefined;
  created_at?: string | null | undefined;
  delivery_address?: string | null | undefined;
  delivery_fee?: string | null | undefined;
  estimated_delivery_time?: string | null | undefined;
  id?: string | null | undefined;
  is_picked_up?: boolean | null | undefined;
  note_to_store?: string | null | undefined;
  order_code?: string | null | undefined;
  order_status?: string | null | undefined;
  payment_method?: string | null | undefined;
  payment_status?: string | null | undefined;
  service_fee?: string | null | undefined;
  store_id?: string | null | undefined;
  sub_total?: string | null | undefined;
  tax_amount?: string | null | undefined;
  tip_amount?: string | null | undefined;
  total_amount?: string | null | undefined;
  user_id?: string | null | undefined;
};
export type CreateOrderMutation$variables = {
  order: ordersInsertInput;
};
export type CreateOrderMutation$data = {
  readonly insertIntoordersCollection: {
    readonly records: ReadonlyArray<{
      readonly courier_id: string | null | undefined;
      readonly created_at: string | null | undefined;
      readonly delivery_address: string | null | undefined;
      readonly delivery_fee: string | null | undefined;
      readonly estimated_delivery_time: string | null | undefined;
      readonly id: string;
      readonly is_picked_up: boolean | null | undefined;
      readonly note_to_store: string | null | undefined;
      readonly order_code: string | null | undefined;
      readonly order_status: string | null | undefined;
      readonly payment_method: string | null | undefined;
      readonly payment_status: string | null | undefined;
      readonly service_fee: string | null | undefined;
      readonly store_id: string | null | undefined;
      readonly sub_total: string | null | undefined;
      readonly tax_amount: string | null | undefined;
      readonly tip_amount: string | null | undefined;
      readonly total_amount: string | null | undefined;
      readonly user_id: string | null | undefined;
    }>;
  } | null | undefined;
};
export type CreateOrderMutation = {
  response: CreateOrderMutation$data;
  variables: CreateOrderMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "order"
  }
],
v1 = [
  {
    "items": [
      {
        "kind": "Variable",
        "name": "objects.0",
        "variableName": "order"
      }
    ],
    "kind": "ListValue",
    "name": "objects"
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
  "name": "order_code",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "user_id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "store_id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "courier_id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "delivery_address",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "payment_method",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "payment_status",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "order_status",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sub_total",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "delivery_fee",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "service_fee",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tax_amount",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "tip_amount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "total_amount",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "note_to_store",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "is_picked_up",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "created_at",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "estimated_delivery_time",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateOrderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ordersInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntoordersCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "orders",
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
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/)
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
    "name": "CreateOrderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "ordersInsertResponse",
        "kind": "LinkedField",
        "name": "insertIntoordersCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "orders",
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
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
              (v20/*: any*/),
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
    "cacheID": "d25109ec5321c846a57b5932077ae06b",
    "id": null,
    "metadata": {},
    "name": "CreateOrderMutation",
    "operationKind": "mutation",
    "text": "mutation CreateOrderMutation(\n  $order: ordersInsertInput!\n) {\n  insertIntoordersCollection(objects: [$order]) {\n    records {\n      id\n      order_code\n      user_id\n      store_id\n      courier_id\n      delivery_address\n      payment_method\n      payment_status\n      order_status\n      sub_total\n      delivery_fee\n      service_fee\n      tax_amount\n      tip_amount\n      total_amount\n      note_to_store\n      is_picked_up\n      created_at\n      estimated_delivery_time\n      nodeId\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9e8b5666d566112702b5c13f6affbd58";

export default node;
