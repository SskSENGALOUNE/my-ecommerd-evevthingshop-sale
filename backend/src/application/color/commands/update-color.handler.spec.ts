import { NotFoundException } from "@nestjs/common";
import { UpdateColorHandler } from "./update-color.handler";
import { UpdateColorCommand } from "./update-color.command";
import type { IColorRepository } from "../../../domain/color/color.repository";

describe("UpdateColorHandler", () => {
  let handler: UpdateColorHandler;
  let repo: jest.Mocked<IColorRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByColor: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    handler = new UpdateColorHandler(repo);
  });

  it("updates color when it exists", async () => {
    const colorId = "uuid-1";
    repo.findById.mockResolvedValue({
      id: colorId,
      color: "RED",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.update.mockResolvedValue({
      id: colorId,
      color: "BLUE",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await handler.execute(
      new UpdateColorCommand(colorId, "BLUE", false),
    );

    expect(result.color).toBe("BLUE");
    expect(result.isActive).toBe(false);
    expect(repo.update).toHaveBeenCalledWith(colorId, {
      color: "BLUE",
      isActive: false,
    });
  });

  it("throws NotFoundException when color does not exist", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new UpdateColorCommand("uuid-999", "GREEN")),
    ).rejects.toThrow(NotFoundException);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("updates only provided fields", async () => {
    const colorId = "uuid-1";
    repo.findById.mockResolvedValue({
      id: colorId,
      color: "RED",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.update.mockResolvedValue({
      id: colorId,
      color: "RED",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await handler.execute(new UpdateColorCommand(colorId, undefined, false));

    expect(repo.update).toHaveBeenCalledWith(colorId, {
      color: undefined,
      isActive: false,
    });
  });
});
