# Features & Capabilities

The **Portier Web App Integration Sync Panel** is organized into four main modules, corresponding to the primary navigation menu.

## 1. Integrations
The Integrations menu is the command center for all third-party data connections.

- **Add Integration**: A guided setup flow to connect new providers (e.g., Salesforce, HubSpot). 
  - **Automated Provisioning**: Upon connection, the system automatically creates **Users**, **Keys**, and **Doors** if the provider data exists (even if only one record is present).
  - **UUID Identification**: To ensure consistency across distributed systems, every new entity created during this process is assigned a **UUID** by default.
- **Synchronization**: Triggers a deep-sync with the provider. 
  - **Conflict Resolution**: A side-by-side audit interface to review incoming changes.
  - **Strict UPDATE Matching**: To ensure data integrity, the system only allows an `UPDATE` if the incoming `current_value` matches the `local_value`.
- **Transparent History**: Access a full audit log of every resolution decision made. Each entry shows exactly which choice was made (Local vs. Incoming) and is linked to specific integration versions for complete transparency.

## 2. Users
Management of all synchronized and local user identities.

- **Centralized View**: Monitor names, emails, and roles across all connected integrations.
- **Integration Mapping**: See exactly which provider (e.g., "Salesforce") each user originated from.
- **Entity Actions**: Edit user details or delete records with built-in safety confirmations.
- **Detail Pages**: Drill down into individual user profiles to see their access history and assigned keys.

## 3. Doors
Control and monitoring of hardware access points.

- **Hardware Status**: Track the real-time connectivity status (Online/Offline) of synced hardware.
- **Health Monitoring**: Monitor critical hardware metrics like battery levels and last-seen timestamps.
- **Location Context**: Each door includes metadata regarding its physical location and device ID.

## 4. Keys
Management of authentication credentials and access permissions.

- **Access Mapping**: Keys serve as the link between **Users** and **Doors**, defining who can enter where.
- **Key Types**: Support for multiple authentication methods, including Digital and Physical keys.
- **Permission Lifecycle**: Control active/inactive statuses and manage access start/end timeframes.
- **Stability**: Secured by a system-wide UUID strategy, ensuring that key relationships remain stable even during complex synchronization cycles.

---

## Technical Roadmap & Planned Enhancements

> [!NOTE]
> Since this is currently only test code and developed within a **limited time**

### 1. Sequential Bulk Synchronization
- **Goal**: Implement the ability to trigger "Bulk Sync" for multiple providers simultaneously.
- **Mechanism**: The system will process each integration one-by-one based on its `application_id`.
- **Conflict Handling**: Integrated sequential conflict resolution, where the user is guided through the `ReviewChangesModal` for each integration in a prioritized queue, ensuring no data state is overwritten by parallel processes.

### 2. Enhanced Integration Detail Views
- **Goal**: Provide deeper visibility into the impact of specific integrations.
- **Mechanism**: Expand the integration detail page to include dedicated sections for **Associated Users** and **Associated Keys**.
- **Benefit**: Admins will be able to instantly see exactly which entities are managed by a provider, making auditing and troubleshooting significantly faster.

