package org.daniel.equipmenttrackingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.daniel.equipmenttrackingsystem.model.Employee;
import org.daniel.equipmenttrackingsystem.model.User;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String position;
    private LocalDate hireDate;
    private boolean active;

    public static EmployeeDTO fromEntity(Employee employee){
        if(employee == null){
            return null;
        }
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getHireDate(),
                employee.isActive()
        );

    }
    public Employee toEntity(){
        Employee employee = new Employee();
        employee.setFirstName(this.firstName);
        employee.setLastName(this.lastName);
        employee.setEmail(this.email);
        employee.setDepartment(this.department);
        employee.setPosition(this.position);
        employee.setHireDate(this.hireDate);
        employee.setActive(this.active);
        return employee;
    }
}
