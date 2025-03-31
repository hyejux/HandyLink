package com.example.HiMade;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;

@SpringBootTest
class HiMadeApplicationTests {

	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;


	@Test
	void contextLoads() {
	}


	@Test
	void testPW(){
		String name = bCryptPasswordEncoder.encode("test1234");
		System.out.println(name);
	}
}
