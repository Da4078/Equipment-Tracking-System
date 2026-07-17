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

    public User createUser(UserDTO userDTO){
        if(userRepository.existsByEmail(userDTO.getEmail())){
            throw new IllegalArgumentException("User already exists");
        }

        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());

        return userRepository.save(user);
    }

    public Optional<User> getUserById(UUID id){
        return userRepository.findById(id);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User updateUser(UUID id, UserDTO userDTO){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());

        return userRepository.save(user);

    }

    public void deleteUser(UUID id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.deleteById(id);
    }
}
