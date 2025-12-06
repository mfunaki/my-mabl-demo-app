#!/bin/bash

SERVICE_URL="${1:-https://expense-app-api-ixi7x7b23a-an.a.run.app}"

echo "Testing API at: $SERVICE_URL"
echo ""

echo "=== 1. Reset ==="
curl -s -X POST ${SERVICE_URL}/api/reset | jq .
echo ""

echo "=== 2. Get expenses (empty) ==="
curl -s -H "Authorization: employee" ${SERVICE_URL}/api/expenses | jq .
echo ""

echo "=== 3. Create expense 1 ==="
curl -s -X POST ${SERVICE_URL}/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: employee" \
  -d '{"title":"Conference","amount":5000}' | jq .
echo ""

echo "=== 4. Create expense 2 ==="
curl -s -X POST ${SERVICE_URL}/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: employee" \
  -d '{"title":"Taxi","amount":1500}' | jq .
echo ""

echo "=== 5. Get expenses (employee) ==="
curl -s -H "Authorization: employee" ${SERVICE_URL}/api/expenses | jq .
echo ""

echo "=== 6. Get expenses (manager) ==="
curl -s -H "Authorization: manager" ${SERVICE_URL}/api/expenses | jq .
echo ""

echo "=== 7. Approve expense 1 ==="
curl -s -X PATCH ${SERVICE_URL}/api/expenses/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: manager" \
  -d '{"status":"APPROVED"}' | jq .
echo ""

echo "=== 8. Get expenses (employee - check status) ==="
curl -s -H "Authorization: employee" ${SERVICE_URL}/api/expenses | jq .
echo ""

echo "✓ All tests completed"
