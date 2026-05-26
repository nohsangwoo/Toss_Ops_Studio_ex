"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { sendDirectFarmOrderNotification } from "@/lib/directfarm/notifications";
import { getPrisma } from "@/lib/prisma";

async function requireDirectFarmAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("관리자 권한이 필요합니다.");
  }
}

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalField(formData: FormData, key: string) {
  const value = field(formData, key);
  return value.length > 0 ? value : undefined;
}

function intField(formData: FormData, key: string, fallback = 0) {
  const value = Number(field(formData, key).replaceAll(",", ""));
  return Number.isFinite(value) ? value : fallback;
}

function normalizeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `directfarm-${Date.now()}`;
}

function revalidateDirectFarm() {
  revalidatePath("/directfarm");
  revalidatePath("/directfarm/admin");
}

export async function createDirectFarmVendorAction(formData: FormData) {
  await requireDirectFarmAdmin();

  await getPrisma().directFarmVendor.create({
    data: {
      name: field(formData, "name"),
      managerName: field(formData, "managerName"),
      phone: field(formData, "phone"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateDirectFarm();
}

export async function updateDirectFarmVendorAction(formData: FormData) {
  await requireDirectFarmAdmin();

  await getPrisma().directFarmVendor.update({
    where: { id: field(formData, "id") },
    data: {
      name: field(formData, "name"),
      managerName: field(formData, "managerName"),
      phone: field(formData, "phone"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateDirectFarm();
}

export async function createDirectFarmProductAction(formData: FormData) {
  await requireDirectFarmAdmin();

  const name = field(formData, "name");

  await getPrisma().directFarmProduct.create({
    data: {
      slug: normalizeSlug(optionalField(formData, "slug") ?? name),
      name,
      description: field(formData, "description"),
      imageUrl: field(formData, "imageUrl"),
      origin: field(formData, "origin"),
      unit: field(formData, "unit"),
      salePrice: intField(formData, "salePrice"),
      wholesalePrice: intField(formData, "wholesalePrice"),
      sortOrder: intField(formData, "sortOrder"),
      vendorId: field(formData, "vendorId"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateDirectFarm();
}

export async function updateDirectFarmProductAction(formData: FormData) {
  await requireDirectFarmAdmin();

  await getPrisma().directFarmProduct.update({
    where: { id: field(formData, "id") },
    data: {
      slug: normalizeSlug(field(formData, "slug")),
      name: field(formData, "name"),
      description: field(formData, "description"),
      imageUrl: field(formData, "imageUrl"),
      origin: field(formData, "origin"),
      unit: field(formData, "unit"),
      salePrice: intField(formData, "salePrice"),
      wholesalePrice: intField(formData, "wholesalePrice"),
      sortOrder: intField(formData, "sortOrder"),
      vendorId: field(formData, "vendorId"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateDirectFarm();
}

export async function resendDirectFarmNotificationAction(formData: FormData) {
  await requireDirectFarmAdmin();

  await sendDirectFarmOrderNotification(field(formData, "orderId"));
  revalidateDirectFarm();
}
