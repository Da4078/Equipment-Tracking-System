package org.daniel.equipmenttrackingsystem.service;

import org.daniel.equipmenttrackingsystem.dto.UserDTO;
import org.daniel.equipmenttrackingsystem.model.User;
import org.daniel.equipmenttrackingsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){ this.userRepository = userRepository;}

    public UserDTO createUser(UserDTO userDTO){
        if(userRepository.existsByEmail(userDTO.getEmail())){
            throw new IllegalArgumentException("User already exists");
        }

        User user = userDTO.toEntity();
        User savedUser = userRepository.save(user);
        return UserDTO.fromEntity(savedUser);
    }

    public Optional<UserDTO> getUserById(UUID id){
        return userRepository.findById(id).map(UserDTO::fromEntity);
    }

    public List<UserDTO> getAllUsers(){

        return userRepository.findAll().stream().map(UserDTO::fromEntity).toList();
    }

    public UserDTO updateUser(UUID id, UserDTO userDTO){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());

        User updatedUser = userRepository.save(user);

        return UserDTO.fromEntity(updatedUser);

    }

    public void deleteUser(UUID id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.deleteById(id);
    }
}
