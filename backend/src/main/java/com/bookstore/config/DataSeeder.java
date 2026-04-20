package com.bookstore.config;

import com.bookstore.entity.*;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import com.bookstore.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping data seeder.");
            return;
        }

        log.info("Seeding database with initial data...");

        User admin = new User("Admin User", "admin@bookstore.com",
                passwordEncoder.encode("Admin@123"), User.Role.ADMIN, "1234567890");
        User user = new User("Regular User", "user@bookstore.com",
                passwordEncoder.encode("User@123"), User.Role.USER, "0987654321");
        userRepository.saveAll(List.of(admin, user));
        log.info("Created admin and regular user accounts");

        Category fiction = new Category("Fiction", "Novels, short stories, and literary works of imagination");
        Category science = new Category("Science", "Books covering scientific discoveries and research");
        Category technology = new Category("Technology", "Computing, programming, and tech industry books");
        Category history = new Category("History", "Historical events, biographies, and civilizations");
        Category selfHelp = new Category("Self-Help", "Personal development and motivational books");
        categoryRepository.saveAll(List.of(fiction, science, technology, history, selfHelp));
        log.info("Created 5 categories");

        Book book1 = createBook("The Great Gatsby", "F. Scott Fitzgerald", "978-0743273565",
                "A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
                new BigDecimal("12.99"), 50, 1925, "Scribner", "English", 180, fiction,
                "https://covers.openlibrary.org/b/id/8432047-L.jpg");

        Book book2 = createBook("To Kill a Mockingbird", "Harper Lee", "978-0061120084",
                "The unforgettable novel of a childhood in a sleepy Southern town.",
                new BigDecimal("14.99"), 35, 1960, "Harper Perennial", "English", 336, fiction,
                "https://covers.openlibrary.org/b/id/8228691-L.jpg");

        Book book3 = createBook("A Brief History of Time", "Stephen Hawking", "978-0553380163",
                "A landmark volume in science writing exploring the universe.",
                new BigDecimal("18.99"), 25, 1988, "Bantam", "English", 212, science,
                "https://covers.openlibrary.org/b/id/8578289-L.jpg");

        Book book4 = createBook("The Selfish Gene", "Richard Dawkins", "978-0198788607",
                "A brilliant exposition of evolutionary thought.",
                new BigDecimal("16.49"), 30, 1976, "Oxford University Press", "English", 544, science,
                "https://covers.openlibrary.org/b/id/8739161-L.jpg");

        Book book5 = createBook("Clean Code", "Robert C. Martin", "978-0132350884",
                "A handbook of agile software craftsmanship.",
                new BigDecimal("39.99"), 45, 2008, "Prentice Hall", "English", 464, technology,
                "https://covers.openlibrary.org/b/id/7267898-L.jpg");

        Book book6 = createBook("The Pragmatic Programmer", "David Thomas & Andrew Hunt", "978-0135957059",
                "Your journey to mastery in software development.",
                new BigDecimal("49.99"), 40, 2019, "Addison-Wesley", "English", 352, technology,
                "https://covers.openlibrary.org/b/id/10388994-L.jpg");

        Book book7 = createBook("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "978-0062316097",
                "A groundbreaking narrative of humanity's creation and evolution.",
                new BigDecimal("22.99"), 55, 2015, "Harper", "English", 464, history,
                "https://covers.openlibrary.org/b/id/8409361-L.jpg");

        Book book8 = createBook("Guns, Germs, and Steel", "Jared Diamond", "978-0393354324",
                "The fates of human societies explained through geography and biogeography.",
                new BigDecimal("19.99"), 28, 1997, "W.W. Norton", "English", 528, history,
                "https://covers.openlibrary.org/b/id/8258647-L.jpg");

        Book book9 = createBook("Atomic Habits", "James Clear", "978-0735211292",
                "Tiny changes, remarkable results. An easy & proven way to build good habits.",
                new BigDecimal("16.99"), 60, 2018, "Avery", "English", 320, selfHelp,
                "https://covers.openlibrary.org/b/id/10958382-L.jpg");

        Book book10 = createBook("The 7 Habits of Highly Effective People", "Stephen R. Covey", "978-1982137274",
                "Powerful lessons in personal change and effectiveness.",
                new BigDecimal("17.99"), 42, 1989, "Simon & Schuster", "English", 464, selfHelp,
                "https://covers.openlibrary.org/b/id/8166963-L.jpg");

        bookRepository.saveAll(List.of(book1, book2, book3, book4, book5, book6, book7, book8, book9, book10));
        log.info("Created 10 sample books");
        log.info("Database seeding completed successfully!");
    }

    private Book createBook(String title, String author, String isbn, String description,
                           BigDecimal price, int stock, int year, String publisher,
                           String language, int pages, Category category, String coverUrl) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setIsbn(isbn);
        book.setDescription(description);
        book.setPrice(price);
        book.setStockQuantity(stock);
        book.setPublicationYear(year);
        book.setPublisher(publisher);
        book.setLanguage(language);
        book.setPageCount(pages);
        book.setCategory(category);
        book.setCoverImageUrl(coverUrl);
        return book;
    }
}
