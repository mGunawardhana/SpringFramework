package lk.ijse.spring;

import lk.ijse.spring.config.AppConfig;
import lk.ijse.spring.di.A;
import lk.ijse.spring.pojo.Boy;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class AppInitializer {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx= new AnnotationConfigApplicationContext();
        ctx.register(AppConfig.class);
        ctx.refresh();
        ctx.registerShutdownHook();

        A bean = ctx.getBean(A.class);
        bean.test();
    }
}
