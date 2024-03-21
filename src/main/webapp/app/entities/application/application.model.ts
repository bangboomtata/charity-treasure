import dayjs from 'dayjs/esm';
import { IVolunteerPost } from 'app/entities/volunteer-post/volunteer-post.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';

export interface IApplication {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  contactNum?: string | null;
  email?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  commitmentDuration?: string | null;
  volunteerExperience?: string | null;
  relevantSkills?: string | null;
  motivation?: string | null;
  applicationDate?: dayjs.Dayjs | null;
  applicationStatus?: ApplicationStatus | null;
  appliedMonday?: boolean | null;
  appliedTuesday?: boolean | null;
  appliedWednesday?: boolean | null;
  appliedThursday?: boolean | null;
  appliedFriday?: boolean | null;
  appliedSaturday?: boolean | null;
  appliedSunday?: boolean | null;
  appliedMorning?: boolean | null;
  appliedAfternoon?: boolean | null;
  appliedEvening?: boolean | null;
  post?: Pick<IVolunteerPost, 'id'> | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewApplication = Omit<IApplication, 'id'> & { id: null };
