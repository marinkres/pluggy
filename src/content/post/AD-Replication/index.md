---
title: "Disrupting and Repairing Active Directory Replication"
description: "Disrupting and Repairing Active Directory Replication"
publishDate: "1 jul 2024"
tags: ["devops", "cybersecurity", "lab"]
updatedDate: 1 jul 2024
---

## Introduction
Active Directory (AD) is the backbone of many organizations, providing centralized authentication, authorization, and directory services. In this project, we explore a challenge:

Intentionally disrupting AD replication from inside between two domain controllers and then restoring it. Our goal is to achieve this without affecting services or network settings replicating an error as it could happen in real life.

## The Scenario
Imagine a scenario where your organization relies on two Windows Server 2019-based domain controllers. Replication between these controllers is crucial for maintaining consistency across the AD forest. However, for testing purposes or troubleshooting, you need to disrupt this synchronization.

**Environment**: Two Windows Server 2019 VM’s with Active Domain Services installed and configured.

**Objective**: Disrupt synchronization between two Active Directory domain controllers (both running Windows Server 2019) and then fix it.

**Constraints**: No manipulation of services or network settings on domain controllers (DCs). Replication disruption must occur “internally,” operating solely on AD objects and/or schema. All services must remain live, and the network should function properly.

## The Approach
### Prerequisites
- Set up two Windows Server 2019 machines mimicking a company network.
- Install and configure Active Directory Domain Services (AD DS).
- Create test users to simulate real-world scenarios.

### Attribute Manipulation:
Our approach involves manipulating specific attributes within AD objects. In this case the replication was disrupted by manipulating the “whenCreated” attribute of User objects.

By default, this attribute is not modifiable; it only shows the “View” option. To work around this limitation, you can use the LDP (LDAP Data Interchange Format) tool.

1. Connect to the domain controller using LDP, authenticate, and modify the “schemaUpgradeInProgress” attribute to the value “1.” This bypasses essential restrictions on attribute manipulation.
2. Find the Distinguished Name (DN) of the “student1” User and identify the format of the attribute you want to manipulate.
3. In this case we modify the “whenCreated” attribute to a new timestamp (e.g., set it to a date in the past).
4. Observe how this affects replication.

```bash title="powershell terminal"
repadmin /replsum
```

## Recovery from Replication Conflict:
During replication attempts, you’ll encounter an error: “A local object with this GUID (dead or alive) already exists.”

Why? Because our modification creates a conflict—the server can’t replicate due to newer changes.

To restore replication:

1. Identify the conflicting object (e.g., the “student1” User).
2. Delete this object.

```bash title="powershell terminal"
Remove-ADUser -Identity student1
```
Replication should resume.

### Conclusion
We’ve explored the intricacies of disrupting and repairing AD replication, by strategically modifying attributes, you can control synchronization behavior.

Remember, this project isn’t about causing chaos in a production environment but understanding the inner workings of AD replication.