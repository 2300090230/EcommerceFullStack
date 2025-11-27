package com.klef.fsd.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import com.klef.fsd.model.Admin;
import com.klef.fsd.repository.AdminRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {

        // check if admin already exists
        if(adminRepository.count() == 0) {

            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin"); // better to encode later

            adminRepository.save(admin);

            System.out.println("Default Admin Created Successfully!");
        }
        else {
            System.out.println("Admin already exists. Skipping creation.");
        }
    }
}
