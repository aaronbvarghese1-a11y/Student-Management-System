package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> updateStudent(Long id, Student newData) {
        return studentRepository.findById(id).map(existing -> {
            existing.setName(newData.getName());
            existing.setEmail(newData.getEmail());
            existing.setCourse(newData.getCourse());
            existing.setPhone(newData.getPhone());
            return studentRepository.save(existing);
        });
    }

    public boolean deleteStudent(Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Student> searchStudents(String keyword) {
        List<Student> result = new ArrayList<>(
                studentRepository.findByNameContainingIgnoreCase(keyword));

        try {
            Long id = Long.parseLong(keyword.trim());
            studentRepository.findById(id).ifPresent(student -> {
                if (!result.contains(student)) {
                    result.add(student);
                }
            });
        } catch (NumberFormatException e) {
            // keyword is not a number, so it is only a name search
        }
        return result;
    }

    public long countStudents() {
        return studentRepository.count();
    }
}
