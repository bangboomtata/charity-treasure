package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VolunteerPostTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VolunteerPost.class);
        VolunteerPost volunteerPost1 = new VolunteerPost();
        volunteerPost1.setId(1L);
        VolunteerPost volunteerPost2 = new VolunteerPost();
        volunteerPost2.setId(volunteerPost1.getId());
        assertThat(volunteerPost1).isEqualTo(volunteerPost2);
        volunteerPost2.setId(2L);
        assertThat(volunteerPost1).isNotEqualTo(volunteerPost2);
        volunteerPost1.setId(null);
        assertThat(volunteerPost1).isNotEqualTo(volunteerPost2);
    }
}
