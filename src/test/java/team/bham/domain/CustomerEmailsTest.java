package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CustomerEmailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomerEmails.class);
        CustomerEmails customerEmails1 = new CustomerEmails();
        customerEmails1.setId(1L);
        CustomerEmails customerEmails2 = new CustomerEmails();
        customerEmails2.setId(customerEmails1.getId());
        assertThat(customerEmails1).isEqualTo(customerEmails2);
        customerEmails2.setId(2L);
        assertThat(customerEmails1).isNotEqualTo(customerEmails2);
        customerEmails1.setId(null);
        assertThat(customerEmails1).isNotEqualTo(customerEmails2);
    }
}
