package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.User;
import com.example.studentmanagement.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void register(User user) {
        String username = user.getUsername() == null ? "" : user.getUsername().trim();
        String password = user.getPassword() == null ? "" : user.getPassword();

        if (username.length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        userRepository.save(newUser);
    }

    public boolean login(String username, String password) {
        if (username == null || password == null) {
            return false;
        }
        Optional<User> user = userRepository.findByUsername(username.trim());
        return user.isPresent()
                && passwordEncoder.matches(password, user.get().getPassword());
    }
}
