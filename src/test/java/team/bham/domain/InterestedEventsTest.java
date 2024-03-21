package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class InterestedEventsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InterestedEvents.class);
        InterestedEvents interestedEvents1 = new InterestedEvents();
        interestedEvents1.setId(1L);
        InterestedEvents interestedEvents2 = new InterestedEvents();
        interestedEvents2.setId(interestedEvents1.getId());
        assertThat(interestedEvents1).isEqualTo(interestedEvents2);
        interestedEvents2.setId(2L);
        assertThat(interestedEvents1).isNotEqualTo(interestedEvents2);
        interestedEvents1.setId(null);
        assertThat(interestedEvents1).isNotEqualTo(interestedEvents2);
    }
}
