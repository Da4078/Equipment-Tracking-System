package org.daniel.equipmenttrackingsystem.exception;

import org.springframework.http.HttpStatus;

public class BusinessRuleException extends BaseDomainException{
    public BusinessRuleException(String message){
        super(message, HttpStatus.BAD_REQUEST);
    }
}
