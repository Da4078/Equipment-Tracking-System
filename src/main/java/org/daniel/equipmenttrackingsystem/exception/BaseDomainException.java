package org.daniel.equipmenttrackingsystem.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BaseDomainException extends RuntimeException{

    private final HttpStatus status;

    public BaseDomainException(String message, HttpStatus status){
        super(message);
        this.status=status;
    }

}
