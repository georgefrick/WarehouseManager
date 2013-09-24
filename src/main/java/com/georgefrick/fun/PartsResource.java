package com.georgefrick.fun;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;

/**
 * PartsResource a restful CRUD interface. This resource when found by an
 * implementation of JAX-RS (tested with RestEasy); will allow for modification
 * of a non-persistent parts database.
 * 
 * @author George Frick (george.frick@gmail.com)
 * 
 */
@Path("/parts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PartsResource {

	/**
	 * For the sake of the example; this is our database! Not production
	 * ready...
	 */
	private static Map<Long, Part> parts = new HashMap<Long, Part>();
	private static long key = 1;

	/**
	 * When getting /parts return all the parts.
	 * 
	 * @return all parts.
	 */
	@GET
	public Collection<Part> getParts() {
		return parts.values();
	}

	/**
	 * When calling POST with no id, create a new Part.
	 * 
	 * @param entry
	 *            The Part, converted from json
	 * @return Part The Part, id added.
	 */
	@POST
	public Part createPart(Part part) {
		part.setId(key);
		parts.put(key++, part);
		return part;
	}

	/**
	 * When calling /parts/# return that Part.
	 * 
	 * @param id
	 *            Id of Part to return.
	 * @return Part The Part with corresponding ID. (or a new Part)
	 */
	@GET
	@Path("/{id}")
	public Part getPart(@PathParam("id") Long id) {
		return parts.get(id);
	}

	/**
	 * When a put is called on /parts/# then that id number will be 'updated'.
	 * 
	 * @param id
	 *            Which Part to update.
	 * @param Part
	 *            New Part data.
	 * @return Part The same Part passed in, in case something "couldn't"
	 *         be updated.
	 */
	@PUT
	@Path("/{id}")
	public Part updatePart(@PathParam("id") Long id, Part part) {
		parts.put(key++, part);
		return part;
	}

	/**
	 * When a delete is called on /parts/# then the Part with that id is
	 * discarded.
	 * 
	 * @param id
	 *            Which Part to delete.
	 * @return OK status.
	 */
	@DELETE
	@Path("/{id}")
	public String deletePart(@PathParam("id") Long id) {
		parts.remove(id);
		return "OK";
	}

}
