const auditEvents = [];

export function addAuditEvent(
  event,
  metadata = {}
) {

  auditEvents.push({

    event,

    timestamp:
      new Date().toISOString(),

    ...metadata
  });

  if (auditEvents.length > 1000) {

    auditEvents.shift();
  }
}

export function getAuditEvents() {

  return auditEvents;
}