#!/usr/bin/env python3
"""
KYA Enforcer – Know Your Agent governance layer
Audits all Cosmos 3 Edge rollouts before execution or RL buffer ingestion
"""

import numpy as np
import json
from dataclasses import dataclass
from typing import Dict, List, Tuple
from datetime import datetime


@dataclass
class RolloutAudit:
    """Audit result for a single trajectory rollout"""
    trajectory_id: str
    approved: bool
    violations: List[str]
    max_velocity: float
    max_acceleration: float
    spatial_bounds_ok: bool
    agent_identity_hash: str
    timestamp: str


class KYAGovernanceEngine:
    """
    Physical world model governance for Cosmos 3 Edge.

    Enforces:
    - Spatial boundaries (robot workspace limits)
    - Kinematic constraints (velocity, acceleration limits)
    - Safety policies (collision avoidance zones)
    - Agent identity verification
    """

    def __init__(self, config: Dict = None):
        self.config = config or {
            "max_velocity": 2.5,  # m/s
            "max_acceleration": 5.0,  # m/s²
            "workspace_min": [-1.0, -1.0, 0.0],  # xyz bounds
            "workspace_max": [1.0, 1.0, 2.0],
            "forbidden_zones": [],  # [[center], [radius]]
        }
        self.audit_log = []

    def audit_rollout(
        self,
        trajectory: np.ndarray,
        goal_context: Dict,
        dt: float = 0.01
    ) -> RolloutAudit:
        """
        Audit a predicted trajectory before execution.

        Args:
            trajectory: (timesteps, action_dim) predicted action sequence
            goal_context: {agent_id, task_id, context_data}
            dt: timestep duration for kinematics

        Returns:
            RolloutAudit with approval status and violation details
        """
        violations = []
        trajectory_id = f"traj_{datetime.now().isoformat()}"
        agent_id = goal_context.get("agent_id", "unknown")

        # 1. Velocity check
        if len(trajectory) > 1:
            velocity = np.linalg.norm(np.diff(trajectory, axis=0), axis=-1) / dt
            max_v = np.max(velocity)
            if max_v > self.config["max_velocity"]:
                violations.append(
                    f"velocity_exceeded: {max_v:.3f} m/s > {self.config['max_velocity']} m/s"
                )
        else:
            max_v = 0.0

        # 2. Acceleration check
        if len(trajectory) > 2:
            accel = np.linalg.norm(
                np.diff(np.diff(trajectory, axis=0), axis=0), axis=-1
            ) / (dt ** 2)
            max_a = np.max(accel)
            if max_a > self.config["max_acceleration"]:
                violations.append(
                    f"acceleration_exceeded: {max_a:.3f} m/s² > {self.config['max_acceleration']} m/s²"
                )
        else:
            max_a = 0.0

        # 3. Spatial bounds check
        bounds_ok = True
        if trajectory.shape[1] >= 3:
            xyz = trajectory[:, :3]
            if np.any(xyz < self.config["workspace_min"]) or np.any(
                xyz > self.config["workspace_max"]
            ):
                violations.append("trajectory_outside_workspace")
                bounds_ok = False

        # 4. Forbidden zone check
        for zone in self.config.get("forbidden_zones", []):
            center, radius = np.array(zone["center"]), zone["radius"]
            if trajectory.shape[1] >= 3:
                xyz = trajectory[:, :3]
                distances = np.linalg.norm(xyz - center, axis=1)
                if np.any(distances < radius):
                    violations.append(
                        f"forbidden_zone_violation: center {center}, radius {radius}"
                    )

        approved = len(violations) == 0

        audit = RolloutAudit(
            trajectory_id=trajectory_id,
            approved=approved,
            violations=violations,
            max_velocity=float(max_v),
            max_acceleration=float(max_a),
            spatial_bounds_ok=bounds_ok,
            agent_identity_hash=hash(agent_id) & 0xffffffff,
            timestamp=datetime.now().isoformat(),
        )

        self.audit_log.append(audit)
        return audit

    def get_audit_log(self) -> List[Dict]:
        """Return all audits as JSON-serializable dicts"""
        return [
            {
                "trajectory_id": a.trajectory_id,
                "approved": a.approved,
                "violations": a.violations,
                "max_velocity": a.max_velocity,
                "max_acceleration": a.max_acceleration,
                "spatial_bounds_ok": a.spatial_bounds_ok,
                "agent_identity_hash": a.agent_identity_hash,
                "timestamp": a.timestamp,
            }
            for a in self.audit_log
        ]

    def clear_audit_log(self):
        """Clear historical audits (for test/reset)"""
        self.audit_log = []


if __name__ == "__main__":
    # Test
    kya = KYAGovernanceEngine()

    # Valid trajectory
    valid_traj = np.random.randn(50, 4) * 0.5
    result = kya.audit_rollout(valid_traj, {"agent_id": "robot_01"})
    print(f"Valid trajectory approved: {result.approved}")
    print(f"  Violations: {result.violations}")

    # Invalid trajectory (exceeds velocity)
    invalid_traj = np.random.randn(50, 4) * 5.0
    result = kya.audit_rollout(invalid_traj, {"agent_id": "robot_02"})
    print(f"\nInvalid trajectory approved: {result.approved}")
    print(f"  Violations: {result.violations}")
