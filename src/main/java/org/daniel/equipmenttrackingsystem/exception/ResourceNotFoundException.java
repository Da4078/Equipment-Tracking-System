package org.daniel.equipmenttrackingsystem.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseDomainException{
    public ResourceNotFoundException(String message){
        super(message, HttpStatus.NOT_FOUND);
    }
}
