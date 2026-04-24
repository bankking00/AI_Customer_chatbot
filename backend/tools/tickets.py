import json
import os
from langchain.tools import tool

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
TICKETS_FILE = os.path.join(DATA_DIR, "tickets.json")

def _load_tickets():
    if not os.path.exists(TICKETS_FILE):
        return []
    try:
        with open(TICKETS_FILE, "r") as f:
            content = f.read()
            return json.loads(content) if content.strip() else []
    except:
        return []

def _save_tickets(tickets):
    with open(TICKETS_FILE, "w") as f:
        json.dump(tickets, f, indent=4)

@tool
def create_ticket(customer_name: str, issue_description: str) -> str:
    """Useful for creating a new support ticket when the user wants to report an issue, return a product, or complain."""
    tickets = _load_tickets()
    
    # Generate simple sequential ID
    new_id = f"TKT{(len(tickets) + 1):03d}"
    
    new_ticket = {
        "ticket_id": new_id,
        "customer_name": customer_name,
        "issue": issue_description,
        "status": "open"
    }
    
    tickets.append(new_ticket)
    _save_tickets(tickets)
    
    return f"Ticket successfully created! Your ticket ID is {new_id}."

@tool
def delete_ticket(ticket_id: str) -> str:
    """Useful for deleting or resolving a support ticket if the customer requests it to be closed."""
    tickets = _load_tickets()
    
    updated_tickets = [t for t in tickets if t.get("ticket_id") != ticket_id]
    
    if len(tickets) == len(updated_tickets):
        return f"Ticket {ticket_id} was not found."
        
    _save_tickets(updated_tickets)
    return f"Ticket {ticket_id} has been successfully deleted/closed."
