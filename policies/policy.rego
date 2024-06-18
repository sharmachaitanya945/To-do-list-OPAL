package authz

default allow = false

allow {
    input.role == "admin"
    input.action == "add"
}

allow {
    input.role == "admin"
    input.action == "delete"
}

allow {
    input.role == "guest"
    input.action == "add"
}

allow {
    input.role == "guest"
    input.action == "delete"
    false
}
