
CREATE TABLE employees(
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    hire_date DATE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE equipment(
    id UUID PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    brand VARCHAR(255),
    model VARCHAR(100),
    status VARCHAR(100) DEFAULT 'AVAILABLE',
    serial_number VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE assignments(
    id UUID PRIMARY KEY,
    employee_id UUID,
    equipment_id UUID,
    assigned_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    returned_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_assignment_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE SET NULL,
    CONSTRAINT fk_assignment_equipment FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE SET NULL
)