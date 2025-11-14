"use client";

interface ProfileCardProps {
  profile: any;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {profile.images?.[0]?.url && (
        <img
          src={profile.images[0].url}
          width={80}
          height={80}
          alt="avatar"
          style={{ borderRadius: "50%", boxShadow: "0 1px 6px #0002" }}
        />
      )}
      <div style={{ textAlign: "left" }}>
        <h2 style={{ margin: 0 }}>{profile.display_name ?? profile.id}</h2>
        <div style={{ color: "#666", fontSize: 15 }}>{profile.email}</div>
      </div>
    </div>
  );
}
