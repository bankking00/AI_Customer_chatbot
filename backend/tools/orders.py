import json
import os
from langchain.tools import tool

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
ORDERS_FILE = os.path.join(DATA_DIR, "orders.json")

@tool
def check_order_status(order_id: str) -> str:
    """Useful for checking the status of a specific order ID (e.g. ORD123)."""
    if not os.path.exists(ORDERS_FILE):
        return f"Error: Order database not found at {ORDERS_FILE}."
        
    try:
        with open(ORDERS_FILE, "r") as f:
            content = f.read()
            if not content.strip():
                orders = []
            else:
                orders = json.loads(content)
    except Exception as e:
         return f"Error parsing orders database: {str(e)}"
        
    for order in orders:
        if order.get("order_id") == order_id:
            status = order.get("status", "unknown")
            shipping = order.get("shipping_date", "N/A")
            arrival = order.get("estimated_arrival", "N/A")
            return f"Order {order_id} is '{status}'. Shipped: {shipping}, Arrival: {arrival}."
            
    return f"Order {order_id} not found."
