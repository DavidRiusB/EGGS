// src/swagger/decorators/appointments.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAppointmentDto } from 'src/modules/appointments/dto/create-appointment.dto';
import { Appointment } from 'src/modules/appointments/entity/appointment.entity';

export function AppointmentsDocs() {
  return applyDecorators(
    ApiTags('Appointments'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function FindAppointmentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find appointments',
      description:
        'Returns appointments matching the supplied filters. Non-admin users are restricted to their own appointments.',
    }),
    ApiOkResponse({
      description: 'Returns a paginated list of appointments.',
      type: Appointment,
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden when filtering by another user without admin rights.',
    }),
  );
}

export function FindAppointmentByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get an appointment by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The appointment ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the requested appointment.',
      type: Appointment,
    }),
    ApiForbiddenResponse({
      description:
        "Forbidden when accessing another user's appointment without admin rights.",
    }),
    ApiNotFoundResponse({ description: 'Appointment not found.' }),
  );
}

export function CreateAppointmentDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create an appointment' }),
    ApiBody({ type: CreateAppointmentDto }),
    ApiCreatedResponse({
      description: 'Returns the newly created appointment.',
      type: Appointment,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({
      description:
        'Forbidden when creating an appointment for another user without admin rights.',
    }),
  );
}

export function UpdateAppointmentDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an appointment' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The appointment ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the updated appointment.',
      type: Appointment,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({
      description:
        "Forbidden when updating another user's appointment without admin rights.",
    }),
    ApiNotFoundResponse({ description: 'Appointment not found.' }),
  );
}

export function CancelAppointmentDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel an appointment' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The appointment ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the cancelled appointment.',
      type: Appointment,
    }),
    ApiForbiddenResponse({
      description:
        "Forbidden when cancelling another user's appointment without admin rights.",
    }),
    ApiNotFoundResponse({ description: 'Appointment not found.' }),
  );
}
